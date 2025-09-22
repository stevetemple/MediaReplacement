using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;

namespace Umbraco.Community.MediaReplacement.Services
{
	public class MediaReplacementComposer : IComposer
	{
		public void Compose(IUmbracoBuilder builder)
		{
			builder.Services.AddTransient<IFilteredEntityService, MediaFoldersOnlyFilteredEntityService>();
		}
	}
}
