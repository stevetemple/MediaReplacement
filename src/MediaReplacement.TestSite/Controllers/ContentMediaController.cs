using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Api.Management.ViewModels.Media.Item;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common.Authorization;

namespace MediaReplacement.Controllers
{
	[ApiController]
	[VersionedApiBackOfficeRoute($"{Constants.UdiEntityType.Document}/{{id}}/{Constants.UdiEntityType.Media}")]
	[ApiExplorerSettings(GroupName = nameof(Constants.UdiEntityType.Document))]
	[Authorize(Policy = AuthorizationPolicies.SectionAccessForMediaTree)]
	public class MediaReferencesController : ManagementApiControllerBase
	{
		private readonly IUmbracoContextFactory _contextFactory;
		private readonly IEntityService _entityService;
		private readonly IMediaPresentationFactory _mediaPresentationFactory;

		public MediaReferencesController(
			IUmbracoContextFactory contextFactory, 
			IEntityService entityService, 
			IMediaPresentationFactory mediaPresentationFactory)
		{
			_contextFactory = contextFactory;
			_entityService = entityService;
			_mediaPresentationFactory = mediaPresentationFactory;
		}

		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<MediaItemResponseModel>), StatusCodes.Status200OK)]
		public Task<IActionResult> GetMediaReferences(
			CancellationToken cancellationToken, Guid id)
		{
			using var contextReference = _contextFactory.EnsureUmbracoContext();
			var content = contextReference.UmbracoContext.Content?.GetById(id);

			if (content == null)
			{
				return Task.FromResult((IActionResult)NotFound());
			}

			var mediaIds = new HashSet<int>();

			foreach (var prop in content.Properties)
			{
				var propType = prop.PropertyType;

				// Media Picker Single & Multiple (Umbraco 9+ uses MediaPicker3)
				if (propType.EditorAlias == "Umbraco.MediaPicker3")
				{
					// Handles both single and multiple
					if (prop.GetValue() is IEnumerable<IPublishedContent> mediaList)
					{
						foreach (var media in mediaList)
						{
							if (media != null)
							{
								mediaIds.Add(media.Id);
							}
						}
					}
					else if (prop.GetValue() is IPublishedContent singleMedia && singleMedia != null)
					{
						mediaIds.Add(singleMedia.Id);
					}
				}
				// Rich Text Editor
				else if (propType.EditorAlias == "Umbraco.TinyMCE")
				{
					var html = prop.GetValue() as string;
					if (!string.IsNullOrEmpty(html))
					{
						// Umbraco v9+ stores media as data-udi="umb://media/xxx"
						var matches = Regex.Matches(html, @"data-udi=""umb://media/([a-z0-9\-]+)""");
						foreach (Match match in matches)
						{
							var udi = match.Groups[1].Value;
							var media = contextReference.UmbracoContext.Media?.GetById(Guid.Parse(udi));
							if (media != null)
							{
								mediaIds.Add(media.Id);
							}
						}
					}
				}
				// TODO TipTap media
			}

			IEnumerable<IMediaEntitySlim> foundMedia = _entityService
				.GetAll(UmbracoObjectTypes.Media, mediaIds.ToArray())
				.OfType<IMediaEntitySlim>();

			IEnumerable<MediaItemResponseModel> responseModels = foundMedia.Select(_mediaPresentationFactory.CreateItemResponseModel);
			return Task.FromResult<IActionResult>(Ok(responseModels));
		}
	}
}