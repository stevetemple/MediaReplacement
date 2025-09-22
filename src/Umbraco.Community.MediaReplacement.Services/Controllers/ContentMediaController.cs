using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Api.Management.ViewModels.Media.Item;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace Umbraco.Community.MediaReplacement.Services.Controllers
{
	[ApiController]
	[VersionedApiBackOfficeRoute($"{Constants.UdiEntityType.Document}/{{id}}/{Constants.UdiEntityType.Media}")]
	[ApiExplorerSettings(GroupName = nameof(Constants.UdiEntityType.Document))]
	[Authorize(Policy = AuthorizationPolicies.SectionAccessForMediaTree)]
	public class MediaReferencesController : ManagementApiControllerBase
	{
		private readonly IEntityService _entityService;
		private readonly IMediaPresentationFactory _mediaPresentationFactory;
		private readonly IRelationService _relationService;

		public MediaReferencesController(
			IRelationService relationService, 
			IEntityService entityService, 
			IMediaPresentationFactory mediaPresentationFactory)
		{
			_relationService = relationService;
			_entityService = entityService;
			_mediaPresentationFactory = mediaPresentationFactory;
		}

		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<MediaItemResponseModel>), StatusCodes.Status200OK)]
		public Task<IActionResult> GetMediaReferences(
			CancellationToken cancellationToken, Guid id)
		{
			var document = _entityService.Get(id, UmbracoObjectTypes.Document);

			if (document == null)
			{
				return Task.FromResult((IActionResult)NotFound());
			}

			var relations = _relationService.GetByParent(document, "umbMedia");

			if(!relations.Any())
			{
				return Task.FromResult((IActionResult)Ok(Enumerable.Empty<MediaItemResponseModel>()));
			}

			IEnumerable<IMediaEntitySlim> foundMedia = _entityService
				.GetAll(UmbracoObjectTypes.Media, relations.Select(r => r.ChildId).ToArray())
				.OfType<IMediaEntitySlim>();

			IEnumerable<MediaItemResponseModel> responseModels = foundMedia.Select(_mediaPresentationFactory.CreateItemResponseModel);
			return Task.FromResult<IActionResult>(Ok(responseModels));
		}
	}
}