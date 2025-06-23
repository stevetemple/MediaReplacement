using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.Controllers.Media.Tree;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.Routing;
using Umbraco.Cms.Api.Management.Services.Entities;
using Umbraco.Cms.Api.Management.ViewModels.Tree;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace MediaSection.Controllers
{

	[ApiController]
	[VersionedApiBackOfficeRoute($"{Constants.Web.RoutePath.Tree}/{Constants.UdiEntityType.Media}")]
	[ApiExplorerSettings(GroupName = nameof(Constants.UdiEntityType.Media))]
	[Authorize(Policy = AuthorizationPolicies.SectionAccessForMediaTree)]
	public class MediaFoldersChildrenController : MediaTreeControllerBase
	{
		private IEntityService _entityService;
		
		public MediaFoldersChildrenController(
			IMediaService mediaService,
				 IEntityService entityService,
				 IUserStartNodeEntitiesService userStartNodeEntitiesService,
				 IDataTypeService dataTypeService,
				 AppCaches appCaches,
				 IBackOfficeSecurityAccessor backofficeSecurityAccessor,
				 IMediaPresentationFactory mediaPresentationFactory)
				 : base(entityService, userStartNodeEntitiesService, dataTypeService, appCaches, backofficeSecurityAccessor, mediaPresentationFactory)
		{
		}

		[HttpGet("folders")]
		[MapToApiVersion("1.0")]
		[ProducesResponseType(typeof(PagedViewModel<MediaTreeItemResponseModel>), StatusCodes.Status200OK)]
		public async Task<ActionResult<PagedViewModel<MediaTreeItemResponseModel>>> Children(
			 CancellationToken cancellationToken,
			 Guid parentId,
			 int skip = 0,
			 int take = 100,
			 Guid? dataTypeId = null)
		{
			IgnoreUserStartNodesForDataType(dataTypeId);
			var children = _entityService.GetChildren(parentId, Umbraco.Cms.Core.Models.UmbracoObjectTypes.Media)
				.Where(i => i.NodeObjectType == new Guid("f38bd2d7-65d0-48e6-95dc-87ce06ec2d3d"));
			return Ok(children);
		}

	}
}
